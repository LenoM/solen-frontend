import { ContactType } from "@/features/client/forms/contact";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/contact";

const deleteContact = async (id: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const params: RequestInit = {
    method: "DELETE",
    headers,
  };

  const contact = await fetch(url, params).then((resp) => resp.json());

  return contact;
};

const updateContact = async ({
  id,
  clientId,
  value,
  contactType,
  isWhatsapp,
}: ContactType) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;
  
  const body: BodyInit = JSON.stringify({
    id,
    clientId,
    value,
    contactType,
    isWhatsapp,
  });

  const params: RequestInit = {
    method: "PUT",
    headers,
    body,
  };
  
  const contact = await fetch(url, params).then((resp) => resp.json());

  return contact;
};

const createContact = async ({
  value,
  clientId,
  contactType,
  isWhatsapp,
}: ContactType) => {
  const headers = getHeader();
  const url = BASE_URL;

  const body: BodyInit = JSON.stringify({
    value,
    clientId,
    contactType,
    isWhatsapp,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const contact = await fetch(url, params).then((resp) => resp.json());

  return contact;
};

export { deleteContact, updateContact, createContact };
