import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ExportService {
  constructor(private readonly supabase: SupabaseService) { }

  async generatePdf(resumeId: string, userId: string): Promise<Buffer> {
    const { data: resume, error } = await this.supabase.admin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single();

    if (error || !resume) throw new NotFoundException('Resume not found');

    return this.buildPdf(resume);
  }

  private buildPdf(resume: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new (PDFDocument as any)({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const p = resume.personal_info || {};
      const BLUE = '#3B82F6';
      const DARK = '#1E293B';
      const GREY = '#64748B';
      const BODY = '#374151';
      const pageWidth = doc.page.width - 100; // margins 50+50

      // ── Name & Contact ────────────────────────────────────────
      doc.fontSize(22).fillColor(DARK).font('Helvetica-Bold')
        .text(p.fullName || 'Resume', { align: 'center' });

      if (p.profession) {
        doc.fontSize(11).fillColor(BLUE).font('Helvetica')
          .text(p.profession, { align: 'center' });
      }

      const contacts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);
      if (contacts.length > 0) {
        doc.fontSize(9).fillColor(GREY).font('Helvetica')
          .text(contacts.join('  |  '), { align: 'center' });
      }

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(50 + pageWidth, doc.y)
        .strokeColor(BLUE).lineWidth(1).stroke();
      doc.moveDown(0.5);

      const section = (title: string) => {
        doc.moveDown(0.3);
        doc.fontSize(11).fillColor(BLUE).font('Helvetica-Bold').text(title.toUpperCase());
        doc.moveTo(50, doc.y).lineTo(50 + pageWidth, doc.y)
          .strokeColor('#E2E8F0').lineWidth(0.5).stroke();
        doc.moveDown(0.2);
      };

      const body = (text: string) => {
        doc.fontSize(9.5).fillColor(BODY).font('Helvetica').text(text, { lineGap: 2 });
      };

      // ── Summary ───────────────────────────────────────────────
      if (resume.professional_summary) {
        section('Professional Summary');
        body(resume.professional_summary);
      }

      // ── Experience ────────────────────────────────────────────
      const exp: any[] = resume.experience || [];
      if (exp.length > 0) {
        section('Experience');
        exp.forEach((e) => {
          const dates = [e.startDate, e.currentlyWorking ? 'Present' : e.endDate].filter(Boolean).join(' – ');
          const x = doc.x;
          doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
            .text(`${e.jobTitle || ''}`, { continued: true })
            .font('Helvetica').fillColor(GREY)
            .text(`  at  ${e.companyName || ''}`, { continued: true });
          if (dates) {
            doc.fillColor(GREY).font('Helvetica-Oblique').fontSize(9)
              .text(`  (${dates})`, { align: 'right' });
          } else {
            doc.text('');
          }
          if (e.description) {
            body(e.description);
          }
          doc.moveDown(0.3);
        });
      }

      // ── Education ─────────────────────────────────────────────
      const edu: any[] = resume.education || [];
      if (edu.length > 0) {
        section('Education');
        edu.forEach((e) => {
          const dates = [e.startDate, e.endDate || 'Present'].filter(Boolean).join(' – ');
          doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
            .text(`${e.degree || ''}  —  ${e.institution || ''}`, { continued: true });
          if (dates) {
            doc.fillColor(GREY).font('Helvetica-Oblique').fontSize(9)
              .text(`  (${dates})`);
          } else {
            doc.text('');
          }
          doc.moveDown(0.2);
        });
      }

      // ── Projects ──────────────────────────────────────────────
      const projects: any[] = resume.projects || [];
      if (projects.length > 0) {
        section('Projects');
        projects.forEach((proj) => {
          doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
            .text(proj.name || '');
          if (proj.description) body(proj.description);
          doc.moveDown(0.3);
        });
      }

      // ── Skills ────────────────────────────────────────────────
      const skills: string[] = resume.skills || [];
      if (skills.length > 0) {
        section('Skills');
        body(skills.join('  ·  '));
      }

      // ── Languages ─────────────────────────────────────────────
      const langs: any[] = resume.languages || [];
      if (langs.length > 0) {
        section('Languages');
        body(langs.map((l: any) => `${l.language} (${l.proficiency})`).join('  ·  '));
      }

      // ── Certifications ────────────────────────────────────────
      const certs: any[] = resume.certifications || [];
      if (certs.length > 0) {
        section('Certifications');
        certs.forEach((c: any) => {
          const line = [c.name, c.issuer, c.date].filter(Boolean).join('  ·  ');
          body(line);
          doc.moveDown(0.2);
        });
      }

      doc.end();
    });
  }
}
