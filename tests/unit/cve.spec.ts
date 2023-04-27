import {expect, test} from '@playwright/test';
import {getCveEntityType} from "@/api/cve/cve";

test.describe('getCveEntityType', () => {
    test('should extract entity type from predicate with "#" separator', () => {
        const entityType = getCveEntityType('cve#vulnerability');
        expect(entityType).toBe('vulnerability');
    });

    test('should extract entity type from predicate with "/" separator', () => {
        const entityType = getCveEntityType('https://example.com/cve/vulnerability');
        expect(entityType).toBe('vulnerability');
    });

    test('should return whole text if predicate does not contain a separator', () => {
        const entityType = getCveEntityType('cvevulnerability');
        expect(entityType).toBe('cvevulnerability');
    });
});
