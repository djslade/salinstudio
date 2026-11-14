import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArtService } from './art.service';
import { ImageService } from '../image/image.service';
import { CollectionService } from '../collection/collection.service';
import { REPOSITORY_NAMES } from '../config/constants';
import { ArtCategory } from './entities/art.entity';

describe('ArtService', () => {
  let service: ArtService;
  let artRepository: Record<string, jest.Mock> & {
    manager?: { transaction: jest.Mock };
  };
  let em: { count: jest.Mock; update: jest.Mock };
  let imageService: jest.Mocked<Pick<ImageService, 'delete' | 'assignToArt'>>;

  const makeArt = (overrides: Record<string, unknown> = {}) => ({
    id: 'art-1',
    slug: 'test-art-abc123',
    totalIndex: 0,
    categoryIndex: 0,
    category: 'acrylic' as ArtCategory,
    image: { id: 'img-1' },
    collections: [],
    ...overrides,
  });

  beforeEach(async () => {
    artRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    em = { count: jest.fn(), update: jest.fn() };
    artRepository.manager = {
      transaction: jest.fn((cb: (m: typeof em) => unknown) => cb(em)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtService,
        { provide: REPOSITORY_NAMES.ART, useValue: artRepository },
        {
          provide: ImageService,
          useValue: { delete: jest.fn(), assignToArt: jest.fn() },
        },
        {
          provide: CollectionService,
          useValue: { getCollectionById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ArtService>(ArtService);
    imageService = module.get(ImageService);
  });

  describe('generateSlug', () => {
    it('produces a lowercase hyphenated slug with a 6-char nanoid suffix', () => {
      const slug = service.generateSlug('My Cool Painting');
      expect(slug).toMatch(/^my-cool-painting-[\w-]{6}$/);
    });

    it('produces unique slugs on repeated calls for the same title', () => {
      const a = service.generateSlug('Same Title');
      const b = service.generateSlug('Same Title');
      expect(a).not.toBe(b);
    });
  });

  describe('findArtById', () => {
    it('returns the art when found', async () => {
      const art = makeArt();
      artRepository.findOne.mockResolvedValue(art);
      await expect(service.findArtById('art-1')).resolves.toEqual(art);
    });

    it('throws NotFoundException when art does not exist', async () => {
      artRepository.findOne.mockResolvedValue(null);
      await expect(service.findArtById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findArtBySlug', () => {
    it('returns the art when found', async () => {
      const art = makeArt();
      artRepository.findOne.mockResolvedValue(art);
      await expect(service.findArtBySlug('test-art-abc123')).resolves.toEqual(
        art,
      );
    });

    it('throws NotFoundException when slug does not match any art', async () => {
      artRepository.findOne.mockResolvedValue(null);
      await expect(service.findArtBySlug('ghost-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPrevAndNext', () => {
    it('returns the adjacent slugs for art in the middle of the list', async () => {
      const first = makeArt({ id: 'a0', totalIndex: 0, slug: 'first' });
      const middle = makeArt({ id: 'a1', totalIndex: 1, slug: 'middle' });
      const last = makeArt({ id: 'a2', totalIndex: 2, slug: 'last' });

      artRepository.find
        .mockResolvedValueOnce([first, middle, last]) // allArtOrdered
        .mockResolvedValueOnce([last]) // allPrevArt (MoreThan 1)
        .mockResolvedValueOnce([first]); // allNextArt (LessThan 1)

      const result = await service.findPrevAndNext(1);
      expect(result).toEqual({ prevSlug: 'last', nextSlug: 'first' });
    });

    it('wraps prev to the first art when at the highest index', async () => {
      const first = makeArt({ id: 'a0', totalIndex: 0, slug: 'first' });
      const last = makeArt({ id: 'a1', totalIndex: 1, slug: 'last' });

      artRepository.find
        .mockResolvedValueOnce([first, last]) // allArtOrdered
        .mockResolvedValueOnce([]) // allPrevArt — none above index 1
        .mockResolvedValueOnce([first]); // allNextArt

      const result = await service.findPrevAndNext(1);
      expect(result.prevSlug).toBe('first'); // wraps to the start
    });

    it('wraps next to the last art when at the lowest index', async () => {
      const first = makeArt({ id: 'a0', totalIndex: 0, slug: 'first' });
      const last = makeArt({ id: 'a1', totalIndex: 1, slug: 'last' });

      artRepository.find
        .mockResolvedValueOnce([first, last]) // allArtOrdered
        .mockResolvedValueOnce([last]) // allPrevArt
        .mockResolvedValueOnce([]); // allNextArt — none below index 0

      const result = await service.findPrevAndNext(0);
      expect(result.nextSlug).toBe('last'); // wraps to the end
    });
  });

  describe('delete', () => {
    it('decrements totalIndex and categoryIndex for art that follows the deleted piece', async () => {
      const toDelete = makeArt({
        id: 'art-1',
        totalIndex: 1,
        categoryIndex: 1,
        category: 'acrylic',
      });
      const before = makeArt({
        id: 'art-0',
        totalIndex: 0,
        categoryIndex: 0,
        category: 'acrylic',
      });
      const after = makeArt({
        id: 'art-2',
        totalIndex: 2,
        categoryIndex: 2,
        category: 'acrylic',
      });

      artRepository.findOne.mockResolvedValue(toDelete);
      artRepository.find.mockResolvedValue([before, toDelete, after]);
      artRepository.save.mockResolvedValue({});
      artRepository.delete.mockResolvedValue({});
      (imageService.delete as jest.Mock).mockResolvedValue(undefined);

      await service.delete('art-1');

      expect(after.totalIndex).toBe(1);
      expect(after.categoryIndex).toBe(1);
      expect(before.totalIndex).toBe(0); // unchanged — comes before
      expect(artRepository.delete).toHaveBeenCalledWith('art-1');
      expect(imageService.delete).toHaveBeenCalledWith('img-1');
    });

    it('does not decrement categoryIndex for art in a different category', async () => {
      const toDelete = makeArt({
        id: 'art-1',
        totalIndex: 1,
        categoryIndex: 1,
        category: 'acrylic',
      });
      const otherCategory = makeArt({
        id: 'art-2',
        totalIndex: 2,
        categoryIndex: 2,
        category: 'watercolor',
      });

      artRepository.findOne.mockResolvedValue(toDelete);
      artRepository.find.mockResolvedValue([toDelete, otherCategory]);
      artRepository.save.mockResolvedValue({});
      artRepository.delete.mockResolvedValue({});
      (imageService.delete as jest.Mock).mockResolvedValue(undefined);

      await service.delete('art-1');

      expect(otherCategory.categoryIndex).toBe(2); // unchanged
      expect(otherCategory.totalIndex).toBe(1); // decremented
    });
  });

  describe('multiple images', () => {
    const img = (id: string, galleryIndex: number) => ({ id, galleryIndex });

    it('createArt uses the first image as lead and assigns all images in order', async () => {
      const images = [img('a', 0), img('b', 0), img('c', 0)];
      artRepository.create.mockReturnValue({});
      artRepository.count.mockResolvedValue(0);
      artRepository.save.mockResolvedValue({ id: 'art-1' });
      artRepository.findOne.mockResolvedValue(makeArt());

      await service.createArt({
        titleEn: 'T',
        titleFi: 'T',
        descriptionEn: '',
        descriptionFi: '',
        category: 'drawings',
        images: images as never,
      });

      expect(artRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ image: images[0] }),
      );
      expect(imageService.assignToArt).toHaveBeenCalledWith('art-1', [
        'a',
        'b',
        'c',
      ]);
    });

    it('createArt rejects more than 5 images', async () => {
      const images = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => img(id, 0));
      await expect(
        service.createArt({
          titleEn: 'T',
          titleFi: 'T',
          descriptionEn: '',
          descriptionFi: '',
          category: 'drawings',
          images: images as never,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('addImages rejects going over 5 images', async () => {
      const existing = ['a', 'b', 'c', 'd'].map((id, i) => img(id, i));
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      await expect(
        service.addImages('art-1', [img('e', 0), img('f', 0)] as never),
      ).rejects.toThrow(BadRequestException);
      expect(imageService.assignToArt).not.toHaveBeenCalled();
    });

    it('addImages appends new images after the existing ones', async () => {
      const existing = [img('a', 0), img('b', 1)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      await service.addImages('art-1', [img('c', 0)] as never);
      expect(imageService.assignToArt).toHaveBeenCalledWith('art-1', [
        'a',
        'b',
        'c',
      ]);
    });

    it('reorderImages saves the new order and makes the first image the lead', async () => {
      const existing = [img('a', 0), img('b', 1), img('c', 2)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );

      await service.reorderImages('art-1', ['c', 'a', 'b']);

      expect(imageService.assignToArt).toHaveBeenCalledWith('art-1', [
        'c',
        'a',
        'b',
      ]);
      expect(artRepository.update).toHaveBeenCalledWith(
        { id: 'art-1' },
        { image: existing[2] },
      );
    });

    it('reorderImages rejects an order that is not a permutation of the current images', async () => {
      const existing = [img('a', 0), img('b', 1)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      for (const ids of [['a'], ['a', 'a'], ['a', 'x'], ['a', 'b', 'x']]) {
        await expect(service.reorderImages('art-1', ids)).rejects.toThrow(
          BadRequestException,
        );
      }
      expect(imageService.assignToArt).not.toHaveBeenCalled();
    });

    it('removeImage promotes the next image before deleting the lead', async () => {
      const existing = [img('a', 0), img('b', 1), img('c', 2)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      const calls: string[] = [];
      artRepository.update.mockImplementation(() => calls.push('update'));
      (imageService.delete as jest.Mock).mockImplementation(() =>
        calls.push('delete'),
      );

      await service.removeImage('art-1', 'a');

      expect(artRepository.update).toHaveBeenCalledWith(
        { id: 'art-1' },
        { image: existing[1] },
      );
      expect(imageService.assignToArt).toHaveBeenCalledWith('art-1', [
        'b',
        'c',
      ]);
      expect(imageService.delete).toHaveBeenCalledWith('a');
      expect(calls).toEqual(['update', 'delete']);
    });

    it('removeImage refuses to remove the last image', async () => {
      const existing = [img('a', 0)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      await expect(service.removeImage('art-1', 'a')).rejects.toThrow(
        BadRequestException,
      );
      expect(imageService.delete).not.toHaveBeenCalled();
    });

    it('removeImage rejects images from another artwork', async () => {
      const existing = [img('a', 0), img('b', 1)];
      artRepository.findOne.mockResolvedValue(
        makeArt({ image: existing[0], images: existing }),
      );
      await expect(service.removeImage('art-1', 'zzz')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('delete removes every image of the artwork', async () => {
      const existing = [img('a', 0), img('b', 1), img('c', 2)];
      const toDelete = makeArt({ image: existing[0], images: existing });
      artRepository.findOne.mockResolvedValue(toDelete);
      artRepository.find.mockResolvedValue([toDelete]);

      await service.delete('art-1');

      expect(imageService.delete).toHaveBeenCalledTimes(3);
      for (const id of ['a', 'b', 'c']) {
        expect(imageService.delete).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('setCarousel', () => {
    const ids = [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333',
    ];

    it('clears the carousel, then adds the listed art in order', async () => {
      em.count.mockResolvedValue(3);
      await service.setCarousel({ ids });

      expect(em.update).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        { onHomeCarousel: true },
        { onHomeCarousel: false, homeCarouselIndex: 0 },
      );
      ids.forEach((id, i) => {
        expect(em.update).toHaveBeenNthCalledWith(
          i + 2,
          expect.anything(),
          { id },
          { onHomeCarousel: true, homeCarouselIndex: i },
        );
      });
    });

    it('rejects unknown ids without changing anything', async () => {
      em.count.mockResolvedValue(2);
      await expect(service.setCarousel({ ids })).rejects.toThrow(
        NotFoundException,
      );
      expect(em.update).not.toHaveBeenCalled();
    });

    it('allows an empty list, which clears the carousel', async () => {
      await service.setCarousel({ ids: [] });
      expect(em.count).not.toHaveBeenCalled();
      expect(em.update).toHaveBeenCalledTimes(1);
      expect(em.update).toHaveBeenCalledWith(
        expect.anything(),
        { onHomeCarousel: true },
        { onHomeCarousel: false, homeCarouselIndex: 0 },
      );
    });
  });

  describe('update', () => {
    const body = {
      titleEn: 'En',
      titleFi: 'Fi',
      descriptionEn: '',
      descriptionFi: '',
      category: 'paintings' as ArtCategory,
      collections: [],
    };

    it('puts art switched on to the carousel at the end', async () => {
      artRepository.findOne
        .mockResolvedValueOnce(makeArt({ onHomeCarousel: false }))
        .mockResolvedValueOnce(makeArt({ id: 'last', homeCarouselIndex: 4 }));
      await service.update('art-1', { ...body, onHomeCarousel: true });
      expect(artRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ onHomeCarousel: true, homeCarouselIndex: 5 }),
      );
    });

    it('puts art first when the carousel is empty', async () => {
      artRepository.findOne
        .mockResolvedValueOnce(makeArt({ onHomeCarousel: false }))
        .mockResolvedValueOnce(null);
      await service.update('art-1', { ...body, onHomeCarousel: true });
      expect(artRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ onHomeCarousel: true, homeCarouselIndex: 0 }),
      );
    });

    it('keeps the position of art already on the carousel', async () => {
      artRepository.findOne.mockResolvedValueOnce(
        makeArt({ onHomeCarousel: true, homeCarouselIndex: 2 }),
      );
      await service.update('art-1', { ...body, onHomeCarousel: true });
      expect(artRepository.findOne).toHaveBeenCalledTimes(1);
      expect(artRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ onHomeCarousel: true, homeCarouselIndex: 2 }),
      );
    });

    it('takes art off the carousel', async () => {
      artRepository.findOne.mockResolvedValueOnce(
        makeArt({ onHomeCarousel: true, homeCarouselIndex: 2 }),
      );
      await service.update('art-1', { ...body, onHomeCarousel: false });
      expect(artRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ onHomeCarousel: false }),
      );
    });
  });
});
