import LoginButton from "../components/LoginButton";

export default {
    title: 'Components/LoginButton',
    component: LoginButton,
};

export const Default = () => <LoginButton />;
export const LoadingButton = () => <LoginButton loading />;

