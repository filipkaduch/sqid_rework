import {SparqlBinding} from "@/api/wikidata/types";
import {sparqlRequest} from "@/api/wikidata";
import {
    feiSecurity, localSparqlCVEEndpoint,
    localSparqlEndpoint
} from "@/api/endpoints";

/* export const previewCveDatabases = async() => {
    const bindingStream = await myEngine.queryBindings('SELECT ?s ?p ?o WHERE { ?s ?p ?o} LIMIT 100', context);
    bindingStream.on('data', (binding: any) => {
        console.log(typeof binding);
        console.log(binding.toString()); // Quick way to print bindings for testing

        console.log(binding.has('s')); // Will be true

        // Obtaining values
        console.log(binding.get('s').value);
        console.log(binding.get('s').termType);
        console.log(binding.get('p').value);
        console.log(binding.get('o').value);
    });
    return null;
}; */

/* export const previewCveClasses = async(): Promise<string[]> => {
    const bindingStream = await myEngine.queryBindings(`SELECT DISTINCT ?class
    WHERE {
      ?class a owl:Class .
      FILTER(STRSTARTS(STR(?class), "${feiSecurityClasses}"))
    }
    `, context);
    const classesList = [] as string[];
    await bindingStream.on('data', (binding: any) => {
        const cleanedClass = extractId(binding.get('class').value);
        classesList.push(cleanedClass);
    });
    return classesList;
}; */

/* export const loadDataForCVE = async(cveId: string) => {
    const bindingStream = await myEngine.queryBindings(`SELECT ?p ?o
    WHERE {
      <${feiSecurity}${cveId}> ?p ?o .
    }`, context);
    const classesObject = {};
    bindingStream.on('data', (binding: any) => {
        const cleanedProp = extractId(binding.get('p').value, '/');
        const valueToClean = binding.get('p').value;
        let cleanedValue = null;
        if (valueToClean.startsWith('\\')) {
            cleanedValue = valueToClean.substring(2, valueToClean.length - 2);
        } else {
            cleanedValue = extractId(valueToClean);
        }
        // @ts-ignore
        classesObject[cleanedProp] = cleanedValue;
    });
    return classesObject;
}; */

export const searchForEntitiesCVE = async(search: string) => {
    const response = await sparqlRequest(localSparqlEndpoint,`
        SELECT ?entity ?property ?value
        WHERE {
          ?entity ?property ?value .
          FILTER (?property = <${feiSecurity}Description>)
          FILTER (regex(str(?value), "${search}", "i"))
        }
        LIMIT 3`);
    return response;
};

export const searchForEntitiesApacheCVE = async(search: string, map: boolean = true) => {
    const response = await sparqlRequest(localSparqlCVEEndpoint, `
            SELECT ?entity ?property ?value
        WHERE {

          ?entity ?property ?value .
          FILTER (?property = <${feiSecurity}Description>)
          FILTER (regex(str(?value), "${search}", "i"))
        }
        LIMIT 3`);
    if (map) {
        return response.results.bindings.map((bind) => ({...bind.entries}))
    }
    return response
};

export const loadCVEById = async(cveId: string) => {
    const response = await sparqlRequest(localSparqlEndpoint,`
        DESCRIBE <${feiSecurity}${cveId}>
    `);
    return response;
};

export const loadCVEByIdApache = async(cveId: string, map: boolean = true) => {
    const response = await sparqlRequest(localSparqlCVEEndpoint,`
        SELECT DISTINCT ?property ?value {
            <${feiSecurity}${cveId}> ?property ?value .
        }`);
    if (map) {
        return response.results.bindings.map((bind) => ({...bind.entries}))
    }
    return response.results.bindings;
};

export const getRelationsQuery = async(): Promise<SparqlBinding[]> => {
    const response = await sparqlRequest(localSparqlEndpoint,
        'SELECT ?s ?p ?o WHERE { ?s ?p ?o}');
    return response.results.bindings;
};
