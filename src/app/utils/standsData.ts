export const StandsTypes = [
  { label: "Stand Aménagé", value: "Fitted Stand" },
  { label: "Espace Nu", value: "Empty Stand" },
  { label: "STARTUP Aménagé", value: "Fitted Startup" },
  { label: "STARTUP NU", value: "Empty Startup" },
];

export const spaceOptions = {
  "Fitted Stand": [
    { label: "Stand Aménagé de 9 M²", value: "9" }, // 4/20
    { label: "Stand Aménagé de 10 M²", value: "10" }, // 4/20
    { label: "Stand Aménagé de 12 M²", value: "12" }, // 6/25
    { label: "Stand Aménagé de 15 M²", value: "15" }, // 6/25
    { label: "Stand Aménagé de 18 M²", value: "18" }, // 8/30
    { label: "Stand Aménagé de 20 M²", value: "20" }, // 8/30
    { label: "Stand Aménagé de 21 M²", value: "21" }, // 10/35
    { label: "Stand Aménagé de 24 M²", value: "24" }, // 10/35
    { label: "Stand Aménagé de 27 M²", value: "27" }, // 10/35
    { label: "Stand Aménagé de 30 M²", value: "30" }, // 12/50
    { label: "Stand Aménagé de 31 M²", value: "31" }, // 12/50
    { label: "Stand Aménagé de 42 M²", value: "42" }, // 15/60
    { label: "Stand Aménagé de 49 M²", value: "49" }, // 20/100
  ],
  "Empty Stand": [
    { label: "Espace nu de 9 M²", value: "9" },
    { label: "Espace nu de 10 M²", value: "10" },
    { label: "Espace nu de 12 M²", value: "12" },
    { label: "Espace nu de 15 M²", value: "15" },
    { label: "Espace nu de 18 M²", value: "18" },
    { label: "Espace nu de 20 M²", value: "20" },
    { label: "Espace nu de 21 M²", value: "21" },
    { label: "Espace nu de 24 M²", value: "24" },
    { label: "Espace nu de 27 M²", value: "27" },
    { label: "Espace nu de 30 M²", value: "30" },
    { label: "Espace nu de 31 M²", value: "31" },
    { label: "Espace nu de 42 M²", value: "42" },
    { label: "Espace nu de 49 M²", value: "49" },
  ],
  "Fitted Startup": [{ label: "STARTUP Aménagé de 3 M²", value: "3" }],
  "Empty Startup": [{ label: "STARTUP NU de 3 M²", value: "3" }],
};

export const standeAmenageImages = [
  "/media/eventili/exhibition/stands/1.png",
  "/media/eventili/exhibition/stands/2.png",
  "/media/eventili/exhibition/stands/3.png",
];

export const standeNuImages = ["/media/eventili/exhibition/stands/nu.png"];

export const startupAmenageImages = [
  "/media/eventili/exhibition/startup/1.jpg",
  "/media/eventili/exhibition/startup/2.jpg",
  "/media/eventili/exhibition/startup/3.jpg",
];

export const startupNuImages = ["/media/eventili/exhibition/startup/nu.png"];

export const getImagesForStandType = (standType: string) => {
  switch (standType) {
    case "Fitted Stand":
      return standeAmenageImages;
    case "Empty Stand":
      return standeNuImages;
    case "Fitted Startup":
      return startupAmenageImages;
    case "Empty Startup":
      return startupNuImages;
    default:
      return [];
  }
};

export const getStandTypeLabel = (value: string): string => {
  const standType = StandsTypes.find((type) => type.value === value);
  return standType ? standType.label : value;
};

export const getStandTypeObject = (value: string) => {
  return StandsTypes.find((type) => type.value === value) || null;
};

// New function to get spaceOptionObject by value (number)
export const getSpaceOptionObjectByValue = (value: string) => {
  for (const standType in spaceOptions) {
    const option = spaceOptions[standType as keyof typeof spaceOptions].find(
      (opt) => opt.value === value
    );
    if (option) {
      return option;
    }
  }
  return null;
};
