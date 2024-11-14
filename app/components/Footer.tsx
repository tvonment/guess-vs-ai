export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>© {year}. Created by <span style={{ color: "#7a95d2" }}>Pjotr Tinke</span> & <span style={{ color: "#ffa74f" }}>Thomas von Mentlen</span></p>
        </footer>
    );
}