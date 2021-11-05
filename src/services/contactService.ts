import * as Contacts from "expo-contacts";

const contactQueryFields = [
  Contacts.Fields.ID,
  Contacts.Fields.FirstName,
  Contacts.Fields.LastName,
  Contacts.Fields.Image,
];

export const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status === Contacts.PermissionStatus.GRANTED) {
    const { data } = await Contacts.getContactsAsync({
      fields: contactQueryFields,
    });

    return data;
  }

  return ([] as unknown) as Contacts.Contact;
};

export const searchContacts = async (query: Contacts.ContactQuery) => {
  query.fields = contactQueryFields;

  const { status } = await Contacts.getPermissionsAsync();

  if (status === Contacts.PermissionStatus.GRANTED) {
    const { data } = await Contacts.getContactsAsync(query);

    return data;
  }

  return ([] as unknown) as Contacts.Contact;
};

export const getContactById = async (id: string) => {
  const { status } = await Contacts.getPermissionsAsync();

  if (status === Contacts.PermissionStatus.GRANTED) {
    const fields = contactQueryFields.push(Contacts.Fields.PhoneNumbers);

    const contact = await Contacts.getContactByIdAsync(id);

    return contact;
  }

  return ({} as unknown) as Contacts.Contact;
};
