import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Dialog } from '../../src/system';
import '../../src/system/styles.css';

function Fixture() {
  const [area, setArea] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [wide, setWide] = useState(false);
  return (
    <div style={{ display: 'flex', blockSize: '100vh' }}>
      <nav aria-label="Fixture navigation" style={{ inlineSize: wide ? 120 : 240, padding: 16, display: 'grid', alignContent: 'start', gap: 8 }}>
        <h1>Dialog fixture</h1>
        <Button variant="secondary" onClick={() => setClicks(count => count + 1)}>Count clicks</Button>
        <output aria-label="Clicks">{clicks}</output>
        <Button variant="secondary" onClick={() => setWide(value => !value)}>Resize area</Button>
        <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
      </nav>
      <main ref={setArea} data-testid="area" style={{ flex: 1, margin: '40px 24px 24px 0', overflow: 'auto' }}>
        <Button onClick={() => setOpen(true)}>Open contained</Button>
        <div style={{ blockSize: 2000 }} />
      </main>
      <Dialog open={open} onOpenChange={setOpen} container={area} freezeHeight size="xl" maxWidth={600} title="Contained dialog" description="TASK-1"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
        <p>Body</p>
      </Dialog>
      <Dialog open={modal} onOpenChange={setModal} title="Modal dialog"><p>Modal body</p></Dialog>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
