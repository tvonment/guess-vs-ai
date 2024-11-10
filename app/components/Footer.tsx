export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>© {year}. Created by Pjotr Tinke & Thomas von Mentlen</p>
        </footer>
    );
}