import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('collection')
export class CollectionController {
  constructor() {}

  @Get()
  async getAllCollections() {}

  @Get(':id')
  async getCollection(@Param('id') id: string) {}

  @Post()
  async postCollection() {}

  @Patch()
  async patchCollection() {}

  @Delete()
  async deleteCollection() { }
}
