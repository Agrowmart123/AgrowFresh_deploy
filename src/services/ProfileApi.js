import api from "./api";

// Get logged in customer profile
export const getCustomerProfile = async () => {
  const res = await api.get("/customer/auth/me");
  return res.data;
};

// Update profile
export const updateCustomerProfile = async (formData) => {
  const res = await api.patch(
    "/customer/auth/update-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// Upload profile photo
export const uploadProfilePhoto = async (formData) => {
  const res = await api.post(
    "/customer/auth/upload-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};