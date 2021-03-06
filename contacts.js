const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const selectContact = contacts.find(item => item.id === Number(contactId));

    if (!selectContact) {
      return console.log(`Contact with id=${contactId} not found`);
    }
    console.table(selectContact);
    return selectContact;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);

    const idx = contacts.findIndex(item => item.id === Number(contactId));
    if (idx === -1) {
      return console.log(`Contact with id=${contactId} cannot be deleted`);
    }
    const newContacts = contacts.filter(item => item.id !== Number(contactId));
    const contactsString = JSON.stringify(newContacts);
    await fs.writeFile(contactsPath, contactsString);

    console.table(newContacts);
    return contacts[idx];
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);

    const validId = id =>
      contacts.some(item => item.id === id) ? validId(id + 1) : id;

    const info = { name, email, phone };
    const newContact = { id: validId(contacts.length), ...info };
    contacts.push(newContact);

    const contactsString = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, contactsString);
    console.table(contacts);
    console.table(newContact);
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
