import QRCodeRedirect from '@/components/QRCodeRedirect';

export const metadata = {
  title: "Güvenli Geçiş | Boğaziçi Koleji",
};

export const viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function QRPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        html, body, #root {
          margin: 0;
          padding: 0;
          min-height: 100dvh;
          overflow-x: hidden;
        }
      `}} />
      <QRCodeRedirect />
    </>
  );
}
