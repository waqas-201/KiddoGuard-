import { createMMKV } from "react-native-mmkv";

export const parentDraft = createMMKV({
    id: 'parent-draft',
    readOnly: false
})
