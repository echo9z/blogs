import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorator/auth.decorator';
import { FindLimitDto } from 'src/dto/find-limit.dto';
import { UserRole } from '../user/entities/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('文章')
@Controller('articles')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: '创建文章' })
  @Auth([UserRole.Admin, UserRole.Author])
  @Post('createArt')
  createArticle(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user, createArticleDto);
  }

  @ApiOperation({ summary: '获取文章列表' })
  @Get('/list')
  findAll(@Query() query: FindLimitDto) {
    return this.articlesService.findAll(query);
  }

  @ApiOperation({ summary: '归档日期列表' })
  @Get('archives')
  async getArchives() {
    return await this.articlesService.getArchives();
  }

  @ApiOperation({ summary: '文章归档' })
  @Get('/archives/list')
  getArchiveList(@Body() body: any) {
    return this.articlesService.getArchiveList(body.time);
  }

  @ApiOperation({ summary: '根据id获取文章' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.articlesService.findById(+id);
  }

  @ApiOperation({ summary: '更新指定id文章' })
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() article: UpdateArticleDto,
  ) {
    return await this.articlesService.updateById(req.user, id, article);
  }

  @ApiOperation({ summary: '删除id文章' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id) {
    return await this.articlesService.remove(id);
  }
}
