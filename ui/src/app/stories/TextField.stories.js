
import TextField from "../components/TextField,";

export default {
    title: 'Components/TextField',
    component: TextField,
};

export const Default = () => <TextField label="Username" />;
export const PasswordField = () => <TextField label="Password" type="password" />;
