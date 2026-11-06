/**
 * Isolates and prints only the resume DOM element inside a dedicated iframe.
 * This guarantees that NO website UI, forms, inputs, or editor toolbars leak into the PDF.
 * Sets the document title to the user's chosen filename so the browser uses it when saving.
 */
export function printResumeElement(elementId: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
      console.error(`Element #${elementId} not found`);
      window.print();
      resolve(false);
      return;
    }

    // Sanitize filename
    const cleanFilename = filename.trim().replace(/[/\\?%*:|"<>]/g, '_') || 'Resume';

    // Remove any previous print iframes
    const oldIframe = document.getElementById('resume-print-iframe');
    if (oldIframe) {
      oldIframe.remove();
    }

    // Create an iframe with real layout dimensions so Chromium can render and print it
    const iframe = document.createElement('iframe');
    iframe.id = 'resume-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '100vh';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    iframe.style.visibility = 'visible';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      window.print();
      resolve(false);
      return;
    }

    // Collect all stylesheets and inline styles from the host document
    const headNodes: string[] = [];
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      headNodes.push(node.outerHTML);
    });

    // Clone the resume sheet
    const clone = originalElement.cloneNode(true) as HTMLElement;
    // Strip preview transforms, fixed heights, and shadows from the clone
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.width = '100%';
    clone.style.maxWidth = '100%';
    clone.style.minHeight = 'auto';
    clone.style.height = 'auto';

    // Build the iframe HTML
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${cleanFilename}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          ${headNodes.join('\n')}
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm 10mm;
            }
            *, *::before, *::after {
              box-sizing: border-box;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
              text-rendering: geometricPrecision !important;
              font-synthesis: none !important;
              font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif !important;
            }
            .print-sheet {
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
              transform: none !important;
              background: white !important;
            }
            h1, h2, h3 {
              break-after: avoid;
              page-break-after: avoid;
            }
            li, .resume-entry {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            a {
              text-decoration: none !important;
              color: inherit !important;
            }
          </style>
        </head>
        <body>
          <div id="print-container">
            ${clone.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Also update main document title temporarily as a fallback for browsers that read top window title
    const prevTitle = document.title;
    document.title = cleanFilename;

    // Wait for fonts & images to finish loading inside iframe
    const triggerPrint = async () => {
      try {
        if (iframe.contentWindow?.document?.fonts) {
          await iframe.contentWindow.document.fonts.ready;
        }
      } catch (err) {
        // Fallback silently if fonts API is unsupported
      }

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Error triggering print on iframe:', e);
          window.print();
        } finally {
          document.title = prevTitle;
          setTimeout(() => {
            iframe.remove();
            resolve(true);
          }, 1000);
        }
      }, 300);
    };

    if (iframe.contentWindow?.document.readyState === 'complete') {
      triggerPrint();
    } else {
      iframe.onload = triggerPrint;
    }
  });
}

