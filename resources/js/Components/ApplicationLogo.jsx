export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/soltiprint_logo_optimizado.jpeg"
            alt="SoltiPrint Logo"
            className={`rounded-lg object-contain ${props.className || ''}`}
        />
    );
}
