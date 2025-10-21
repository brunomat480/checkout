import { cva, type VariantProps } from 'class-variance-authority';
import { createElement, type JSX, type ReactNode } from 'react';

const textVariants = cva('font-sans text-foreground', {
	variants: {
		variant: {
			xl: 'text-xl leading-8 font-bold',
			lg: 'text-lg leading-6',
			base: 'text-base leading-6',
			md: 'text-md leading-6',
			sm: 'text-sm leading-6',
		},
	},
	defaultVariants: { variant: 'sm' },
});

interface TextProps extends VariantProps<typeof textVariants> {
	children: ReactNode;
	as?: keyof JSX.IntrinsicElements;
	className?: string;
}

export function Text({
	as = 'span',
	children,
	variant,
	className,
	...props
}: TextProps) {
	return createElement(
		as,
		{
			className: textVariants({
				variant,
				className,
			}),
			...props,
		},
		children,
	);
}
