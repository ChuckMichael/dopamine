import { ExternalComponent } from '../../../core/base/external-component';
import { ComponentsComponent } from './components.component';

describe('ComponentsComponent', () => {
    let component: ComponentsComponent;

    beforeEach(() => {
        component = new ComponentsComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeTruthy();
        });
    });

    describe('externalComponents', () => {
        it('should return a list of external components', async () => {
            // Arrange

            // Act
            const externalComponents: ExternalComponent[] = component.externalComponents;

            // Assert
            expect(externalComponents.length).toBeGreaterThan(0);
        });
    });
});
