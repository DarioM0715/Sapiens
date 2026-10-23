import type { Dispatch, SetStateAction } from "react";

export type StepChanger = Dispatch<SetStateAction<number>>;

export type StringChanger = Dispatch<SetStateAction<string>>;