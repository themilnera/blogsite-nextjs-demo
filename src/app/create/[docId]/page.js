import Create from "@/components/create";

export default async function DocPageId({ params }){
    const { docId } = await params;
    if(docId)
        return(
            <Create docId={docId}></Create>
        )
    else
        return(<></>)

}