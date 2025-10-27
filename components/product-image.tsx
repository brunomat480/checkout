'use client';

import Image from 'next/image';
import { type ComponentProps, useState } from 'react';

import placeholderImage from '@/assets/images/placeholder.png';

interface ProductImageProps
	extends Omit<ComponentProps<typeof Image>, 'src' | 'onError'> {
	src: string | null | undefined;
}

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
	const [imgSrc, setImgSrc] = useState(src || placeholderImage);

	return (
		<Image
			{...props}
			src={imgSrc}
			alt={alt}
			onError={() => setImgSrc(placeholderImage)}
		/>
	);
}
