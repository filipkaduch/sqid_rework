export const cveLocalEndpoints = [
    'http://localhost:8080/database/cve_gen/CVE-2000-owl.owl',
    'http://localhost:8080/database/cve_gen/OVAL_ios.owl'
    /* 'http://localhost:8080/database/cve/cve_generate_data_1999.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2000.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2001.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2002.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2003.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2004.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2005.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2006.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2007.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2008.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2009.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2010.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2011.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2012.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2013.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2014.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2015.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2016.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2017.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2018.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2019.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2020.rdf',
    'http://localhost:8080/database/cve/cve_generate_data_2021.rdf' */
];

export const cveEndpointsSources = [
    {type: 'file', value: cveLocalEndpoints[0], name: 'CVE - 2000'},
    {type: 'file', value: cveLocalEndpoints[1], name: 'OVAL - iOS'}
];

export const context = {
    sources: cveEndpointsSources,
    '@context': {
        sources: {
            '@id': 'urn:sources',
            '@type': '@id'
        }
    }
};