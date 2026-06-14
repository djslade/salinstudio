import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArtService } from './art.service';
import { ImageService } from '../image/image.service';
import { CollectionService } from '../collection/collection.service';
import { REPOSITORY_NAMES } from '../config/constants';
import { ArtCategory } from './entities/art.entity';

describe('ArtService', () => {
  let service: ArtService;
  let artRepository: Record<string, jest.Mock>;
  let imageService: jest.Mocked<Pick<ImageService, 'delete'>>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtService,
        { provide: REPOSITORY_NAMES.ART, useValue: artRepository },
        {
          provide: ImageService,
          useValue: { delete: jest.fn() },
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
});
