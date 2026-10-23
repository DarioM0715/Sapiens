export const DEFAULT_AVATAR = "/images/avatar-default.svg";
export const DEFAULT_BACKGROUND = "/images/background-default.svg";

export const avatarOrDefault = (avatar?: string | null): string => (avatar?.trim() ? avatar : DEFAULT_AVATAR);

export const backgroundOrDefault = (background?: string | null): string => (background?.trim() ? background : DEFAULT_BACKGROUND);