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
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../user/entities/user.entity';
import { Auth } from 'src/decorator/auth.decorator';

@ApiTags('导航page')
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @ApiOperation({ summary: '创建导航页' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth([UserRole.Admin])
  @Post('createPage')
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @ApiOperation({ summary: '获取导航页所有数据' })
  @Get('findPages')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllPage() {
    return await this.pageService.findAllPage();
  }

  @ApiOperation({ summary: '获取文章、分类、标签 总数' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('findArticleInfo')
  async find() {
    return await this.pageService.findArticleInfo();
  }

  @ApiOperation({ summary: '根据id，获取page信息' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(+id);
  }

  @ApiOperation({ summary: '根据id，对page更新' })
  @Auth([UserRole.Admin])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return await this.pageService.update(+id, updatePageDto);
  }

  @ApiOperation({ summary: '根据id 删除Page导航项' })
  @Auth([UserRole.Admin])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.pageService.remove(+id);
  }
}
