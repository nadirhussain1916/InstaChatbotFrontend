import { useTheme } from '@mui/material/styles';

const useGetTheme = () => {
    const theme = useTheme();
    const palettes = theme.palette;
    return {
        primary: palettes.primary,
        secondary: palettes.secondary
    };
};

export default useGetTheme;
