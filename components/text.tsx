import { cva, type VariantProps } from 'class-variance-authority';
import { createElement, type JSX, type ReactNode } from 'react';

const textVariants = cva('font-sans', {
	variants: {
		variant: {
			title: 'text-2xl leading-8 font-bold text-foreground tracking-tight',
			subtitle: 'text-xl leading-7 font-semibold text-foreground',
			heading: 'text-lg leading-7 font-semibold text-foreground',
			description: 'text-sm leading-5 text-muted-foreground',
			body: 'text-base leading-6 text-foreground',
			small: 'text-sm leading-5 text-foreground',
			muted: 'text-sm leading-5 text-muted-foreground',
			label:
				'text-xs leading-4 font-medium text-foreground uppercase tracking-wider',
		},
	},
	defaultVariants: {
		variant: 'body',
	},
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
