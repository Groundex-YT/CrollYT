export interface Settings {
    PREFIX?: string;
    TOKEN: string;
    COLOR: ColorTypes;
    CLIENT_ID?: number;
}

export interface ColorTypes {
    SUCCESS?: string;
    ERROR?: string;
    WARNING?: string;
    TELL?: string;
}
