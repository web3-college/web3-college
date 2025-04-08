import Player from 'next-video/player';

export default function VideoPlayer({ src }: { src: string }) {
  return <Player src={src} />;
}