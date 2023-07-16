export const constructFormData = (name: string, file: File): FormData => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);
    return formData;
};
