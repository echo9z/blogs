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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindLimitDto } from 'src/dto/find-limit.dto';
import { UserRole } from '../user/entities/user.entity';
import { Auth } from 'src/decorator/auth.decorator';

@ApiTags('标签')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建标签' })
  @Auth([UserRole.Admin, UserRole.Author])
  @Post('createTag')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @ApiOperation({ summary: '获取标签数量' })
  @Get('count')
  async getCount() {
    return await this.tagService.getCount();
  }

  @ApiOperation({ summary: '分页所有标签' })
  @Get('list')
  @UseInterceptors(ClassSerializerInterceptor)
  async findTagAll(@Body() body: FindLimitDto) {
    return await this.tagService.findAll(body);
  }

  @ApiOperation({ summary: '获取所有标签' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('allTags')
  async getAllTags() {
    return await this.tagService.getAllTags();
  }

  @ApiOperation({ summary: '根据id获取标签' })
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string) {
    return await this.tagService.findOne(id);
  }

  @ApiOperation({ summary: '根据id标签，进行更新' })
  @Auth([UserRole.Admin])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return await this.tagService.update(+id, updateTagDto);
  }

  @ApiOperation({ summary: '根据id 删除标签' })
  @Auth([UserRole.Admin])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(+id);
  }
}
