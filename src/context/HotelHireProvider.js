import React from 'react';
import { Provider, atom } from 'jotai';

export const aicAtom = atom('');
export const companyNameAtom = atom('');
export const firstNameAtom = atom('');
export const lastNameAtom = atom('');
export const contactEmailAtom = atom('');
export const contactPhoneAtom = atom('');
export const contactPasswordAtom = atom('');
export const userRoleAtom = atom('');
export const entryDateAtom = atom('');
export const addressAtom = atom({
  street: '',
  street2: '',
  city: '',
  state: '',
  zip: '',
});
export const avatarAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const passwordAtom = atom('');
export const signatureAtom = atom('');
export const AcknowledgementAtom = atom(false)

export const AuthContext = React.createContext();

const HotelHireProvider = ({ children }) => {
  return (
    <Provider>
      <AuthContext.Provider value = {{}}>
        {children}
      </AuthContext.Provider>
    </Provider>
  );
};

export default HotelHireProvider;
