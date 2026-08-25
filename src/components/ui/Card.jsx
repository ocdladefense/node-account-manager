export default function Card({ title, description, children, actions, className = '' }) {

    return (
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`}>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="justify-end card-actions">{children || <button className="btn btn-primary">Go</button>}</div>

            </div>
        </div>
    );
}
