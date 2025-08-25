const useSearch = () => {
  const search = (data, keys, query) => {
    if (query?.length === 0) {
      return data;
    } else
      return data?.filter((item) =>
        keys?.some((key) =>
          item[key]?.toLowerCase()?.includes(query?.toLowerCase())
        )
      );
  };

  return { search };
};

export default useSearch;
