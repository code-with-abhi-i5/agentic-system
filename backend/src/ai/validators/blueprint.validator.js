import { validateTasks } from "./task.validator.js";
import { validateDependencies } from "./dependency.validator.js";
import { validateEdges } from "./edge.validator.js";
import { validateGraph } from "./graph.validator.js";
import { validateConstraints } from "./constraint.validator.js";
import { calculateMetrics } from "./metrics.js";

export const validateBlueprint = (
    blueprint
) => {

    const errors = [];
    const warnings = [];

    /* -------------------------------- */
    /* Task Validation                  */
    /* -------------------------------- */

    const taskValidation =
        validateTasks(
            blueprint.tasks
        );

    errors.push(
        ...taskValidation.errors
    );

    warnings.push(
        ...taskValidation.warnings
    );

    /* -------------------------------- */
    /* Dependency Validation            */
    /* -------------------------------- */

    const dependencyValidation =
        validateDependencies(
            blueprint.tasks
        );

    errors.push(
        ...dependencyValidation.errors
    );

    warnings.push(
        ...dependencyValidation.warnings
    );

    /* -------------------------------- */
    /* Edge Validation                  */
    /* -------------------------------- */

    const edgeValidation =
        validateEdges(
            blueprint.tasks,
            blueprint.edges
        );

    errors.push(
        ...edgeValidation.errors
    );

    warnings.push(
        ...edgeValidation.warnings
    );

    /* -------------------------------- */
    /* Graph Validation                 */
    /* -------------------------------- */

    const graphValidation =
        validateGraph(
            blueprint.tasks,
            blueprint.edges
        );

    errors.push(
        ...graphValidation.errors
    );

    warnings.push(
        ...graphValidation.warnings
    );

    /* -------------------------------- */
    /* Constraint Validation            */
    /* -------------------------------- */

    const constraintValidation =
        validateConstraints(
            blueprint
        );

    errors.push(
        ...constraintValidation.errors
    );

    warnings.push(
        ...constraintValidation.warnings
    );

    /* -------------------------------- */
    /* Metrics                          */
    /* -------------------------------- */

    let metrics = null;

    if (errors.length === 0) {

        metrics = calculateMetrics(
            blueprint
        );

    }

    /* -------------------------------- */
    /* Final Result                     */
    /* -------------------------------- */

    return {

        valid:
            errors.length === 0,

        blueprint,

        metrics,

        errors,

        warnings

    };

};