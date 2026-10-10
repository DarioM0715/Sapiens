import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary capturó:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-primary p-6">
          <div className="bg-surface-2 border-default rounded-2xl shadow-md p-8 max-w-md text-center flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Algo salió mal</h1>
            <p className="text-muted">
              Ha ocurrido un error inesperado. Por favor, intenta iniciar sesión de nuevo.
            </p>
            <Link
              to="/login"
              onClick={() => this.setState({ hasError: false })}
              className="inline-block px-6 py-3 rounded-xl btn-primary text-center font-medium"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
