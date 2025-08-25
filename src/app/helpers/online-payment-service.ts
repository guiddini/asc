const satimLink = ({
  id,
  price,
  returnURL,
}: {
  id: string | number;
  price: string | number;
  returnURL: string;
}) => {
  const satimLink = `https://test.satim.guiddini.dz/SATIM-WFGWX-YVC9B-4J6C9/${
    import.meta.env.VITE_APP_SATIM_LICENSE
  }/cib.php?order_id=${id}&total=${price}&returnUrl=${returnURL}`;
  return window.open(satimLink, "_blank");
};
export { satimLink };
