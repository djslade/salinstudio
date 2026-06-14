import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PurchasableService } from './purchasable.service';
import { ImageService } from '../image/image.service';
import { REPOSITORY_NAMES } from '../config/constants';

describe('PurchasableService', () => {
  let service: PurchasableService;
  let purchasableRepository: Record<string, jest.Mock>;
  let imageService: jest.Mocked<Pick<ImageService, 'delete'>>;

  const makePurchasable = (overrides: Record<string, unknown> = {}) => ({
    id: 'p-1',
    nanoId: 'nano1234',
    titleEn: 'Nice Painting',
    titleFi: 'Hieno Maalaus',
    quantity: 2,
    isPublic: true,
    images: [],
    art: { id: 'art-1', image: { id: 'img-1' } },
    ...overrides,
  });

  beforeEach(async () => {
    purchasableRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasableService,
        {
          provide: REPOSITORY_NAMES.PURCHASABLE,
          useValue: purchasableRepository,
        },
        {
          provide: ImageService,
          useValue: { delete: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PurchasableService>(PurchasableService);
    imageService = module.get(ImageService);
  });

  describe('findByNanoId', () => {
    it('returns the purchasable when found', async () => {
      const p = makePurchasable();
      purchasableRepository.findOne.mockResolvedValue(p);
      await expect(service.findByNanoId('nano1234')).resolves.toEqual(p);
    });

    it('throws NotFoundException when no purchasable matches the nanoId', async () => {
      purchasableRepository.findOne.mockResolvedValue(null);
      await expect(service.findByNanoId('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('returns the purchasable when found', async () => {
      const p = makePurchasable();
      purchasableRepository.findOne.mockResolvedValue(p);
      await expect(service.findById('p-1')).resolves.toEqual(p);
    });

    it('throws NotFoundException when id does not exist', async () => {
      purchasableRepository.findOne.mockResolvedValue(null);
      await expect(service.findById('ghost')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('artIdIsAssigned', () => {
    it('throws BadRequestException when the art is already assigned to a store item', async () => {
      purchasableRepository.findOne.mockResolvedValue(makePurchasable());
      await expect(service.artIdIsAssigned('art-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('resolves without error when the art is not yet assigned', async () => {
      purchasableRepository.findOne.mockResolvedValue(null);
      await expect(service.artIdIsAssigned('art-free')).resolves.not.toThrow();
    });
  });

  describe('decrementQuantity', () => {
    it('decrements quantity by 1 and saves', async () => {
      const p = makePurchasable({ quantity: 3 });
      purchasableRepository.findOne.mockResolvedValue(p);
      purchasableRepository.save.mockResolvedValue({});

      await service.decrementQuantity('nano1234');

      expect(p.quantity).toBe(2);
      expect(purchasableRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 2 }),
      );
    });

    it('does nothing when the purchasable is not found', async () => {
      purchasableRepository.findOne.mockResolvedValue(null);
      await service.decrementQuantity('missing');
      expect(purchasableRepository.save).not.toHaveBeenCalled();
    });

    it('does nothing when quantity is already 0', async () => {
      purchasableRepository.findOne.mockResolvedValue(
        makePurchasable({ quantity: 0 }),
      );
      await service.decrementQuantity('nano1234');
      expect(purchasableRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the purchasable and removes its extra images', async () => {
      const extraImage = { id: 'img-extra' };
      const artImage = { id: 'img-1' };
      const p = makePurchasable({
        images: [extraImage, artImage],
        art: { id: 'art-1', image: artImage },
      });
      purchasableRepository.findOne.mockResolvedValue(p);
      purchasableRepository.delete.mockResolvedValue({});
      (imageService.delete as jest.Mock).mockResolvedValue(undefined);

      await service.delete('p-1');

      expect(purchasableRepository.delete).toHaveBeenCalledWith('p-1');
      // img-extra should be deleted; img-1 (same as art.image) should be skipped
      expect(imageService.delete).toHaveBeenCalledWith('img-extra');
      expect(imageService.delete).not.toHaveBeenCalledWith('img-1');
    });

    it('skips image deletion when the purchasable has no images', async () => {
      const p = makePurchasable({ images: [] });
      purchasableRepository.findOne.mockResolvedValue(p);
      purchasableRepository.delete.mockResolvedValue({});

      await service.delete('p-1');

      expect(imageService.delete).not.toHaveBeenCalled();
    });
  });
});
