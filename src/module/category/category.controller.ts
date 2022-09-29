import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindLimitDto } from 'src/dto/find-limit.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('文章分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post('createCate')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '获取分类数量' })
  @Get('count')
  async getCount() {
    return await this.categoryService.getCount();
  }

  @ApiOperation({ summary: '获取所有分类' })
  @Get('list')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Body() body?: FindLimitDto) {
    return await this.categoryService.findAll(body);
  }

  @ApiOperation({ summary: '根据id获取分类' })
  @Get(':id')
  // @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: number) {
    return await this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: '根据id分类，进行更新' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: '根据id 删除分类' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
