import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Request, NotFoundException
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
    constructor(private readonly service: ResumesService) { }

    @Get()
    list(@Request() req) {
        return this.service.listByUser(req.user.id);
    }

    @Post()
    create(@Request() req, @Body() body: { title: string }) {
        return this.service.create(req.user.id, body.title);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.service.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req, @Body() body: any) {
        return this.service.update(id, req.user.id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.service.remove(id, req.user.id);
    }

    @Post(':id/toggle-public')
    togglePublic(@Param('id') id: string, @Request() req) {
        return this.service.togglePublic(id, req.user.id);
    }

    @Post(':id/duplicate')
    duplicate(@Param('id') id: string, @Request() req) {
        return this.service.duplicate(id, req.user.id);
    }
}
