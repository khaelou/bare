export const fetchMediaBlob = async (targetRef: any, storageMediaURL: string) => {
    const response = await fetch(storageMediaURL);
    const blob = await response.blob();
    targetRef.value = URL.createObjectURL(blob);
};