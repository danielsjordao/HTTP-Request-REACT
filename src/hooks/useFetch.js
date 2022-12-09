import {useState, useEffect} from 'react'

// 4 - custom hook
export const useFetch = (url) => {
    const [data, setData] = useState(null);

    // 5 - refatorando post
    const [config, setConfig] = useState(null)
    //configurar o método que vai ser utilizado POST, configurar os headers por essa razão que precisamos ter essa configuração.
    const [method, setMethod] = useState (null)
    // Esse vai dizer qual método que estarei utilizando na minha função, se vai ser GET ou POST
    const [callFetch, setCallFetch] = useState(false)
    // ele vai servir para entrar no useEffect e deve ser mapeado, 
    //sempre que alterá-lo irá chamar o Fetch para mapear de novo. Ex. Adicionamos um dado no sistema. Agora dá um callFetch para que retorne os dados atualizados

    // 6 - Loading
    const [loading, setLoading] = useState(false);

    // 7 - Tratando Erros
    const [error, setError] = useState(null);

    // 8 - desafio 6
    const [itemId, setItemId] = useState(null);

    const httpConfig = (data, method) => { //recebimento dos dados de envio e o método
        if(method === "POST") {
            setConfig({
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            setMethod(method);            
        } else if (method === "DELETE"){
            setConfig({
                method,
                headers: {
                    "Content-Type": "application/json"
                },                
            });
            setMethod(method);
            setItemId(data);
        }
    };

    useEffect(() => {
        const fetchData = async () => {

            // 6 - Loading
            setLoading(true);

            try {
                const res = await fetch(url);

                const json = await res.json();
    
                setData(json);

            } catch (error){
                console.log(error.message);
                setError("Houve algum erro ao carregar os dados!")
            }

            setLoading(false);
        };

        fetchData();
    }, [url, callFetch]);

    // 5 - refatorando post
    useEffect(() => {
        const httpRequest = async () => {

            let json 

            if(method === "POST") {
                let fetchOptions = [url, config];
    
                const res = await fetch (...fetchOptions);
    
                json = await res.json();                
                //executar automaticamente uma requisição de "GET" quando o "POST" for concluído
            } else if (method === "DELETE"){
                const deleteUrl = `${url}/${itemId}`;

                const res = await fetch(deleteUrl, config);

                json = await res.json();

            }
            setCallFetch(json);
        }        
        httpRequest();
        // com essa checagem é possível saber se é uma função de "POST", "UPDATE".
    }, [config, method, url])
    // config sendo mapeada, sempre que houver uma alteração na config, será chamado o useEffect
    // o useEffect vai fazer uma checagem Se o method for "POST", quero fazer um apanhado de minhas configuracoes de URL 

    return { data, httpConfig, loading, error };    
};

