export const generateGuid = () => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
export const defaultQuery = {
    id: '',
    loading: false,
    searched: false,
    order: 0,
    dataSource: null
};