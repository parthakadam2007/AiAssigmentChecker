import useFetch from "../../../shared/hooks/UseFetch"
import SectionContent from "./SectionContent"
const classSection: React.FC<{ class_id: string | undefined }> = ({ class_id }) => {
    const { data, error, status } = useFetch<any>({ method: "GET", url: `${import.meta.env.VITE_BACKEND_URL}/class/classInfo/${class_id}` })
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (status === "error") {
        return <div>Error loading data: {error && error.message ? error.message : String(error)}</div>;
    }
    return (

        <div>
            {/* {JSON.stringify(data)} */}

            {data && <SectionContent classInfo={data} />}

        </div>
    )
}

export default classSection