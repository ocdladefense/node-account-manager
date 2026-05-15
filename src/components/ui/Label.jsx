export default function Label({ data, prefix }) {
    return (
        <div className="absolute"
            style={{ top: "-15px", left: "0px", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "5px 13px", borderRadius: "10px", fontSize: "13px" }}
        >
            <div className="">{prefix + data}</div>
        </div>
    );
}
