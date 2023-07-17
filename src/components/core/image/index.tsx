import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const ExternalImage = LazyLoadImage;

export const InternalImage = Image;
