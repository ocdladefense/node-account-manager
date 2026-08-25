export default function Card({ title, description, actions, children, className = '' }) {

    return (
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`}>
            <div className="card-body">

                <h2 className="card-title">{title}</h2>

                {children}

                <p>{description}</p>

                <div className="justify-end card-actions">{actions}</div>

            </div>
        </div>
    );
}
