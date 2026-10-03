import { tool } from "@langchain/core/tools";
import { z } from "zod";
import puppeteer from "puppeteer";
import { logger } from "../../utils/logger.js";

export const documentGeneratorTool = tool(
    async (args) => {
        let browser = null;
        try {
            logger.info(`📄 Generating PDF document: ${args.filename}`);
            
            // 1. Launch Puppeteer to generate the PDF
            browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            
            // Set the HTML content
            await page.setContent(args.htmlContent, { waitUntil: 'domcontentloaded' });

            // Generate PDF buffer in memory (Zero Local Storage)
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                }
            });

            logger.info(`📄 PDF generated in memory (${pdfBuffer.length} bytes). Uploading to cloud...`);

            // 2. Upload to tmpfiles.org (Ephemeral Storage)
            const filename = args.filename.endsWith('.pdf') ? args.filename : `${args.filename}.pdf`;
            const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('file', blob, filename);

            const response = await fetch('https://tmpfiles.org/api/v1/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'success') {
                throw new Error(`Upload API Error: ${JSON.stringify(data)}`);
            }

            // tmpfiles returns https://tmpfiles.org/ID/filename
            // To get the direct download link, we inject /dl/ after the domain
            const downloadLink = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

            logger.info(`✅ Upload successful: ${downloadLink}`);

            // 3. Return the markdown link
            return `Document successfully generated! Here is the secure download link (valid for 60 minutes):\n\n[Download ${filename}](${downloadLink})`;

        } catch (error) {
            logger.error(`❌ Document Generator Error: ${error.message}`);
            return `Failed to generate and upload document: ${error.message}`;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    },
    {
        name: "document_generator_tool",
        description: "Generates a highly-styled PDF document (like a Resume, Invoice, or Report) from raw HTML/CSS and returns a secure, temporary download link. Always write beautiful HTML/CSS for the document.",
        schema: z.object({
            filename: z.string().describe("The name of the file to be generated (e.g., 'Priya_Resume.pdf')."),
            htmlContent: z.string().describe("The complete, beautifully styled HTML and CSS string that represents the document.")
        })
    }
);
