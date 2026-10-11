import type {
ReactNode,
ButtonHTMLAttributes,
AnchorHTMLAttributes,
} from "react";

type SharedProps = {
    children: ReactNode;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary";
};

type LinkButtonProps = SharedProps & {
    href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

type ActionButtonProps = SharedProps & {
    href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

type ButtonProps = LinkButtonProps | ActionButtonProps;

const sizeClasses = {
    sm: "rounded-xl px-4 py-2 text-[13px]",
    md: "rounded-2xl px-6 py-3.5 text-[15px]",
    lg: "rounded-2xl px-8 py-4 text-base",
};

export default function Button(props: ButtonProps) {
    const {
        children,
        icon,
        iconPosition = "right",
        className = "",
        size = "md",
        variant = "primary",
        ...rest
    } = props;

    const classes = `btn-${variant} ${sizeClasses[size]} ${className}`.trim();

    const content = (
        <>
            {iconPosition === "left" && icon}
            <span>{children}</span>
            {iconPosition === "right" && icon}
        </>
        );

        if (props.href !== undefined) {
            return (
                <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
                    href={props.href}
                    className={classes}
                >
                    {content}
                </a>
            );
        }

        return (
        <button {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
            className={classes}
            type={props.type ?? "button"}
        >
            {content}
        </button>
    );
}
