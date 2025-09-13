export const handleInputChange = (e, setFormData) => {
  const { id, value, type, checked } = e.target;

  setFormData((prevData) => ({
    ...prevData,
    [id]: type === "checkbox" ? checked : value,
  }));
};

export const handleFileInput = (id, file, setFormData) => {
  setFormData((prevData) => ({
    ...prevData,
    [id]: file,
  }));
};

export const handleDropdownChange = (data, setFormData) => {
  setFormData((prevData) => ({
    ...prevData,
    country: data.country,
    state: data.state,
    city: data.city,
  }));
};
