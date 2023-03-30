import myEngine from "@/api/cve/index";
import {context} from "@/api/cve/cve";
import {SparqlBinding} from "@/api/wikidata/types";
import {sparqlRequest} from "@/api/wikidata";
import {
    feiOntologyEndpoint,
    feiSecurity,
    feiSecurityClasses,
    localSparqlEndpoint,
    rdfSchemaSyntax
} from "@/api/endpoints";
import {extractId} from "@/api/malwares/malwares";

export const previewCveDatabases = async() => {
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
};

export const previewCveClasses = async(): Promise<string[]> => {
    const bindingStream = await myEngine.queryBindings(`SELECT DISTINCT ?class
    WHERE {
      ?class a owl:Class .
      FILTER(STRSTARTS(STR(?class), "${feiSecurityClasses}"))
    }
    `, context);
    const classesList = [] as string[];
    await bindingStream.on('data', (binding: any) => {
        const cleanedClass = extractId(binding.get('class').value);
        console.log(cleanedClass);
        classesList.push(cleanedClass);
    });
    return classesList;
};

export const previewCveNamedIndividuals = async(): Promise<{}[]> => {
    const bindingStream = await myEngine.queryBindings(`SELECT DISTINCT ?class
    WHERE {
      ?class a owl:NamedIndividual .
      FILTER(STRSTARTS(STR(?class), "${feiSecurityClasses}"))
    } LIMIT 100
    `, context);
    const classesList = [] as {}[];
    bindingStream.on('data', async(binding: any) => {
        const cleanedClass = extractId(binding.get('class').value, '/');
        const propObject = await loadDataForCVE(cleanedClass);
        console.log(propObject);
        classesList.push(propObject);
    });
    console.log('SHOW CLASSES: ', classesList);
    return classesList;
};

export const loadDataForCVE = async(cveId: string) => {
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
        console.log(cleanedValue);
        // @ts-ignore
        classesObject[cleanedProp] = cleanedValue;
    });
    console.log(classesObject);
    return classesObject;
};

export const searchForEntitiesCVE = async(search: string) => {
    console.log(`
        SELECT DISTINCT ?s ?p ?o
    WHERE { 
      ?s ?p ?o .
        FILTER (regex(?o, "${search}", "i")) .
      FILTER (?p = <${feiSecurity}Title> ||
              ?p = <${feiSecurity}Description>) .
      ?s ?p ?filterValue .
    } LIMIT 10`);
    const bindingStream = await myEngine.queryBindings(`
        SELECT DISTINCT ?s ?p ?o
    WHERE { 
      ?s ?p ?o .
        FILTER (regex(?o, "${search}", "i")) .
      FILTER (?p = <${feiSecurity}Title> ||
              ?p = <${feiSecurity}Description>) .
      ?s ?p ?filterValue .
    } LIMIT 10`, context);
    bindingStream.on('data', (binding: any) => {
        console.log(binding.toString()); // Quick way to print bindings for testing

        // Obtaining values
        console.log(binding.get('s').value);
        console.log(binding.get('s').termType);
        console.log(binding.get('p').value);
        console.log(binding.get('o').value);
    });
    return null;
};

export const getRelationsQuery = async(): Promise<SparqlBinding[]> => {
    const response = await sparqlRequest(localSparqlEndpoint,
        'SELECT ?s ?p ?o WHERE { ?s ?p ?o}');
    return response.results.bindings;
};
